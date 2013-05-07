<?php
namespace PFBC\Element;

class BootstrapDateTime extends Textbox {
    protected $_attributes = array("type" => "text", "data-format" => "dd/MM/yyyy hh:mm:ss");
    protected $append = '<i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>';

    public function getCSSFiles() {
        if(!in_array("bootstrap-datetimepicker", $this->_form->getPrevent))
            return array($this->_form->getPrefix . "bootstrap/css/bootstrap-datetimepicker.min.css");
    }

    public function getJSFiles() {
        if(!in_array("bootstrap-datetimepicker", $this->_form->getPrevent))
            return array($this->_form->getPrefix . "bootstrap/js/bootstrap-datetimepicker.min.js");
    }

    public function jQueryDocumentReady() {
        parent::jQueryDocumentReady();
        echo 'jQuery("#', $this->_attributes["id"], '").parent().datetimepicker(', $this->jQueryOptions(), ');';
    }
}
