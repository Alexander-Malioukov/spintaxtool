
function initForm() {
	hideHelp();
	loadHtpasswdFileContent();
}

function resetForm() {
	hideHelp();
	$('#users-passwords').val('').focus();
}

function showHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('' +
			"<p>Cet outil permet de générer des paires login / mot de passe afin de contrôler l'accès aux outils de Radiance Conseil.</p>" +
			"<p>Ces informations sont stockées dans un fichier nommé <b>.htpasswd</b>. Chaque login est écrit en clair, chaque mot de passe est crypté.</p>" +
			"<p>Par défaut, les logins des utilisateurs contenus dans le fichier <b>.htpasswd</b>, s'il existe, sont affichés dans la zone <b>Utilisateurs et mots de passe</b>.</p>" +
			"<p>Vous pouvez :" +
				"<ul>" +
					"<li>Ajouter une paire login / mot de passe. Une ligne par utilisateur : <span style='font-family:Courier New'>nom_utilisateur_sans_espacements&lt;ESPACE&gt;mot_de_passe</span> (exemple : <span style='font-family:Courier New'>radiance Vb3wQb7hOm</span>).</li>" +
					"<li>Modifier le mot de passe d'un utilisateur.</li>" +
					"<li>Recommencer la saisie (cliquer sur le bouton <b>Recommencer</b>).</li>" +
					"<li>Attribuer des mots de passe aléatoires pour tous les utilisateurs (cliquer sur le bouton <b>Attribuer des mots de passe</b>).</li>" +
					"<li>Générer le fichier <b>.htpasswd</b> sur votre filesystem (cliquer sur le bouton <b>Générer le fichier .htpasswd</b>).</li>" +
				"</ul>" +
			"</p>" +
			"<p><i style='margin-right:10px' class='fa fa-lightbulb-o'></i>À noter : le contenu du fichier <b>.htpasswd</b> étant écrasé à chaque clic sur le bouton <b>Générer le fichier .htpasswd</b>, veillez à rappeler les logins et mots de passe des utilisateurs accrédités au moment où vous souhaitez ajouter ou supprimer l'un d'eux.</p>"
		);
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-up'></i> Masquer l'aide").off('click').on('click', hideHelp);
		$(this).slideDown(400);
	});
	
}

function hideHelp() {
	$('.info-message[class~=help]').slideUp(400, function() {
		$(this).find('.help-content').html('');
		$(this).find('.close-button a').html("<i class='fa fa-fw fa-chevron-down'></i> Afficher l'aide").off('click').on('click', showHelp);
		$(this).slideDown(400);
	});
}

function loadHtpasswdFileContent() {
	$.ajax({
		url: 'php/ajax/load-htpasswd-file-content.php',
		success: function(jsonResponse) {
			if (!jsonResponse.success) {
				MyUtils.displayInfoMessage('warning', "Action impossible : " + jsonResponse.message);
			}
			else {
				if ( !jsonResponse.fileContent ) {
					MyUtils.displayInfoMessage('warning', "Fichier .htpasswd vide ou introuvable");
				}
				else {
					var aLogins = extractLoginsFromHtpasswdFileContent(jsonResponse.fileContent);
					$('#users-passwords').val(aLogins.join('\r\n')).focus();
					MyUtils.displayInfoMessage('success', "Logins contenus dans le fichier .htpasswd chargés");
				}
			}
		},
		error: function(request, error) {
			showServerErrorNotification(request);
		}
	});
}

function generatePasswords() {
	var userPasswords = '';
	
	if ( !$('#users-passwords').val().trim() ) {
		MyUtils.displayInfoMessage('warning', "Veuillez saisir au moins un login");
		$('#users-passwords').focus()
	}
	else {
		$.each($('#users-passwords').val().split('\n'), function(i,line) {
			var login = line.trim().split(' ')[0];
			if (login) {
				var password = $.ajax({url: 'php/ajax/get-generated-password.php', async: false}).responseJSON;
				userPasswords += ( userPasswords ? '\n' : '' ) + login + ' ' + password;
			}
		});
		$('#users-passwords').val(userPasswords);
	}
}

function generateHtpasswdFile() {
	if ( !hasEachLoginAPassword() ) {
		MyUtils.displayInfoMessage('warning', "Veuillez associer un mot de passe à chaque login");
	}
	else {
		$.ajax({
			url: 'php/ajax/generate-htpasswd-file.php',
			data: { fileContent: $('#users-passwords').val().trim() },
			success: function(jsonResponse) {
				if (!jsonResponse.success) {
					MyUtils.displayInfoMessage('warning', "Action impossible : " + jsonResponse.message);
				}
				else {
					MyUtils.displayInfoMessage('success', "Le fichier .htpasswd a bien été généré");
				}
			},
			error: function(request, error) {
				showServerErrorNotification(request);
			}
		});
	}
}

function hasEachLoginAPassword() {
	var result = true;
	$.each($('#users-passwords').val().split('\n'), function(i,line) {
		var password = line.trim().split(' ')[1];
		if ( !password ) {
			result = false;
			return false; // beak each
		}
	});
	return result;
}

/**
 * @param	{string} fileContent
 * @returns	{Array}
 */
function extractLoginsFromHtpasswdFileContent(fileContent) {
	var aLogins = [];

	$.each(fileContent.split('\r\n'), function(i, line) {
		aLogins.push(line.split(':')[0]);
	});
	
	return aLogins;
}















