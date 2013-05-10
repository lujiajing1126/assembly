<?php
namespace PFBC\Element;

class BootstrapDateTime extends Textbox {
    protected $_attributes = array("type" => "text", "data-format" => "yyyy-MM-dd hh:mm:ss");
    protected $append = '<i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>';
    protected $language, $maskInput, $pickDate, $pickTime, $pick12HourFormat, $pickSeconds, $startDate, $endDate;

    public function getCSSFiles() {
        if(!in_array("bootstrap-datetimepicker", $this->_form->getPrevent()))
            return array("/bootstrap/css/bootstrap-datetimepicker.min.css");
    }

    public function getJSFiles() {
        if(!in_array("bootstrap-datetimepicker", $this->_form->getPrevent()))
            return array("/bootstrap/js/bootstrap-datetimepicker.min.js");
    }

    public function jQueryOptions() {
        $this->jQueryOptions = null;
        $properties = array("language", "maskInput", "pickDate", "pickTime", "pick12HourFormat", "pickSeconds", "startDate", "endDate");
        foreach ($properties as $name) {
            if ($this->$name !== null) {
                if (! is_array($this->jQueryOptions)) $this->jQueryOptions = array();
                $this->jQueryOptions[$name] = $this->$name;
            }
        }
        return parent::jQueryOptions();
    }

    public function jQueryDocumentReady() {
        parent::jQueryDocumentReady();
        echo 'jQuery("#', $this->_attributes["id"], '").parent().datetimepicker(', $this->jQueryOptions(), ');';
    }

	public function render() {
		$this->validation[] = new \PFBC\Validation\DateWithFormat($this->_attributes["data-format"]);
		parent::render();
	}
}

