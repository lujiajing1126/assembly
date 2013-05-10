<?php
namespace PFBC\Validation;

class Options extends \PFBC\Validation {
    protected $message = "Error: %element% must contain a provided option.";
    protected $available;

    public function __construct($available, $message = "") {
        parent::__construct($message);
        $this->available = $available;
    }

    public function isValid($value) {
        return is_array($this->available) && in_array($value, $this->available);
    }
}
