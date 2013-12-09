<?php
namespace PFBC\Validation;

class DateWithFormat extends \PFBC\Validation {
    protected $message = "Error: %element% must contain a valid date.";
    protected $format;

    public function __construct($format, $message = "") {
        parent::__construct($message);
        $this->format = $format;
    }

    public function isValid($value) {
        try {
            $date = \DateTime::createFromFormat($this->format, $value);
            return true;
        } catch(\Exception $e) {
            return false;
        }
    }
}
