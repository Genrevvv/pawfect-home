<?php
    function isValidPhoneNumber($number) {
        return preg_match('/^(09\d{9}|\+639\d{9})$/', trim($number));
    }

    function isValidCard($number) {
        $number = preg_replace('/[\s-]/', '', $number);
        return preg_match('/^\d{16}$/', $number);
    }
?>