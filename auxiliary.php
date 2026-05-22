<?php
    function isValidPhoneNumber($number) {
        return preg_match('/^(09\d{9}|\+639\d{9})$/', trim($number));
    }

    function isValidCard($number) {
        $number = preg_replace('/[\s-]/', '', $number);
        return preg_match('/^\d{16}$/', $number);
    }

    function isValidApplication($data) {

        $requiredStrings = [
            'full_name',
            'email_address',
            'phone_number',
            'home_address',
            'reason',
            'existing_pet',
            'house_type',
            'yard_type'
        ];

        foreach ($requiredStrings as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                return false;
            }
        }

        if (
            !isset($data['selected_pets']) ||
            !is_array($data['selected_pets']) ||
            count($data['selected_pets']) === 0
        ) {
            return false;
        }

        return true;
    }

?>