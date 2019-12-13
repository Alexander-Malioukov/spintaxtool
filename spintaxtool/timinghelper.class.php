<?php
class CLEANERTiminghelper {
    
    /**
	 * @var The single instance of the class
	 */
	protected static $_instance = null;

	/**
	 *
	 * Ensures only one instance is loaded or can be loaded.
	 *
	 * @static
	 * @return class instance
	 */
     
     public static function instance() {

		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}
    
    private $start;
    
    /**
	 * Cloning is forbidden.
	 *
	 * @since 1.2
	 */
	public function __clone() {}

	/**
	 * Unserializing instances of this class is forbidden.
	 *
	 * @since 1.2
	 */
	public function __wakeup() {}

    public function start() {
        $this->start = microtime(true);
    }

    public function segs() {
        return microtime(true) - $this->start;
    }

    public function time() {
        $segs = $this->segs();
        $days = floor($segs / 86400);
        $segs -= $days * 86400;
        $hours = floor($segs / 3600);
        $segs -= $hours * 3600;
        $mins = floor($segs / 60);
        $segs -= $mins * 60;
        $microsegs = ($segs - floor($segs)) * 1000;
        $segs = floor($segs);

        return 
            (empty($days) ? "" : $days . "d ") . 
            (empty($hours) ? "" : $hours . "h ") . 
            (empty($mins) ? "" : $mins . "m ") . 
            $segs . "s " .
            $microsegs . "ms";
    }
}
function CLRTHP() {
    return CLEANERTiminghelper::instance();
}
CLRTHP();