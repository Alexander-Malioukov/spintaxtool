#! /usr/bin/python

import glob,os,codecs,sys,cgi, zipfile, random
from itertools import permutations

def zipdir(fileNames, zip):
	for filename in fileNames:
		zip.write(filename)

class BaseSpinner(object):
	"""Base Spinner Class
	   Spins all permutation of paragraphs.
	"""
	
	def __init__(self, fileName):
		self.fileName = fileName 
		
	def generateSpunFileName(self,fName):
		"""Generate Spun file name from given file name."""
		return fName.split('.txt')[0]+'-final.txt'
		
	
	def loadParagraphs(self):
		"""Load paragraphs from .txt file and returns as generator object"""
		fp = codecs.open(self.fileName,'r')	
		paragraphs = fp.readlines()
		fp.close()
		
		#do some cleanup & return as generator object
		paragraphs = [s.strip() for s in paragraphs if s.strip() != '']
		paragraphs_genObj = permutations(paragraphs,len(paragraphs))
		return paragraphs_genObj
		
	def writeToFile(self):
		outputFileName = self.generateSpunFileName(self.fileName)
		paragraphs_genObj = self.loadParagraphs()
		try:
			os.remove(outputFileName)
		except:
			pass
		output_fp = codecs.open(outputFileName,'a') 
		output_fp.write('{')

		#use StopIteration to detect last item
		while True:
			try:
				paragraph = paragraphs_genObj.next()
				fileStat = os.stat(outputFileName)
			except StopIteration:
				s = ''
				s = ' '.join(paragraph)
				s = s.strip()
				output_fp.write(s)
				break
			s = ''
			s = ' '.join(paragraph)
			s = s.strip() + '|'.strip()
			output_fp.write(s)

		output_fp.write('}')
		output_fp.close()
	
class SpinnerSingleFile(BaseSpinner):
	"""Spins upto a given limit & generates a single file."""
	def __init__(self, fileName, fileLimit):
		BaseSpinner.__init__(self, fileName)
		self.fileLimit =  fileLimit * (1024-25) * 1024
		
	def writeToFile(self):
		outputFileName = self.generateSpunFileName(self.fileName)
		paragraphs_genObj = self.loadParagraphs()
		try:
			os.remove(outputFileName)
		except:
			pass
		output_fp = codecs.open(outputFileName,'a') 
		output_fp.write('{')

		#use StopIteration to detect last item
		while True:
			try:
				paragraph = paragraphs_genObj.next()
				fileStat = os.stat(outputFileName)
				if fileStat.st_size >= self.fileLimit:
					raise StopIteration("stop")
			except StopIteration:
				s = ''
				s = ' '.join(paragraph)
				s = s.strip()
				output_fp.write(s)
				break
			s = ''
			s = ' '.join(paragraph)
			s = s.strip() + '|'.strip()
			output_fp.write(s)

		output_fp.write('}')
		output_fp.close()	
		
class SpinnerMultiFile(SpinnerSingleFile):
	"""Given a file limit, generates multiple output files output files of given file limit."""
	def __init__(self, fileName, fileLimit):
		SpinnerSingleFile.__init__(self, fileName, fileLimit)
		self.fileNum = 0
		self.filesList = []
	
	def generateSpunFileName(self,fName):
		"""Generate Spun file name from given file name."""
		self.fileNum += 1
		return fName.split('.txt')[0] + "-final_" + str(self.fileNum) + '.txt'
		
	def writeToFile(self):
		paragraphs_genObj = self.loadParagraphs()
		while True:
			try:
				next_item = paragraphs_genObj.next()
				self.writeToSingleFile(paragraphs_genObj)
			except StopIteration:
				break
		
		zip = zipfile.ZipFile(self.fileName + '.zip', 'w')
		zipdir(self.filesList, zip)
		zip.close()
		
		for filename in self.filesList:
			try:
				os.remove(filename)
			except:
				pass
		
	
	def writeToSingleFile(self,paragraphs_genObj):
		outputFileName = self.generateSpunFileName(self.fileName)
		self.filesList.append(outputFileName)
		try:
			os.remove(outputFileName)
		except:
			pass
		output_fp = codecs.open(outputFileName,'a') 
		output_fp.write('{')

		#use StopIteration to detect last item
		while True:
			try:
				paragraph = paragraphs_genObj.next()
				fileStat = os.stat(outputFileName)
				if fileStat.st_size >= self.fileLimit:
					raise StopIteration("stop")
			except StopIteration:
				s = ''
				s = ' '.join(paragraph)
				s = s.strip()
				output_fp.write(s)
				break
			s = ''
			s = ' '.join(paragraph)
			s = s.strip() + '|'.strip()
			output_fp.write(s)
		
		output_fp.write('}')
		output_fp.close()


import cgitb
cgitb.enable()
query = os.environ["QUERY_STRING"]
pairs = cgi.parse_qs(query)

filename = pairs["filename"][0]
slimit = float(pairs["slimit"][0])
stype = int(float(pairs["stype"][0]))

if stype == 1:
	spinnerFull = BaseSpinner(filename)
	spinnerFull.writeToFile()
	print "Content-Type: text/plain"
	print "Content-Disposition: attachment; filename="+spinnerFull.generateSpunFileName(filename)
	print
	print open(spinnerFull.generateSpunFileName(filename)).read()
	
	try:
		os.remove(filename)
		os.remove(spinnerFull.generateSpunFileName(filename))
	except:
		pass
	
elif stype == 2:
	spinnerSingle = SpinnerSingleFile(filename,slimit)
	spinnerSingle.writeToFile()
	print "Content-Type: text/plain"
	print "Content-Disposition: attachment; filename="+spinnerSingle.generateSpunFileName(filename)
	print
	print open(spinnerSingle.generateSpunFileName(filename)).read()
	
	try:
		os.remove(filename)
		os.remove(spinnerSingle.generateSpunFileName(filename))
	except:
		pass
		
elif stype == 3:
	from datetime import datetime
	ts = datetime.utcnow().strftime("%s")
	spinnerMulti = SpinnerMultiFile(filename,slimit)
	spinnerMulti.writeToFile()
	
	#get the zip file size
	fsize = os.stat(filename+".zip").st_size 
	
	#if output zip file is large, don't force download
	if fsize > 30*1024*1024:
		print "Content-type: text/html\n\n"
		print "<center><a href='/spin-reorder/cgi-bin/"+filename+".zip'>Download Output File</a><br/></center>"
		print "<center><a href='/spin-reorder/cleanup.php?ts="+ts+"&f1="+filename+"&f2="+filename+".zip'>Delete Output File</a></center>"
	else:
		print "Content-Type: application/octet-stream"
		print "Content-Disposition: attachment; filename="+filename+".zip"
		print
		print open(filename+".zip").read()
		
		try:
			os.remove(filename)
			os.remove(filename+".zip")
		except:
			pass


