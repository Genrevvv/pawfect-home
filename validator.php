<?php
    function isValidAuthInput($username, $password, $confirm = null) {
        if (trim($username) === '' || trim($password) === '') {
            return ['valid' => false, 'error' => 'Please fill up all fields'];
        }

        if (strlen(trim($username)) < 3) {
            return ['valid' => false, 'error' => 'Please input at least 3 character for username'];
        }

        if (strlen($password) < 8) {
            return ['valid' => false, 'error' => 'Please input at least 8 characters for password'];
        }

        if ($confirm !== null && $password !== $confirm) {
            return ['valid' => false, 'error' => 'Password and confirm doesn\'t match'];
        }

        return ['valid' => true];
    }

    function isValidPhoneNumber($number) {
        return preg_match('/^(09\d{9}|\+639\d{9})$/', trim($number));
    }

    function isValidCard($number) {
        $number = preg_replace('/[\s-]/', '', $number);
        return preg_match('/^\d{16}$/', $number);
    }

    function isValidProduct($data) {
        $requiredStrings = [
            'product_name',
            'description',
            'category',
            'pet_type'
        ];

        foreach ($requiredStrings as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                return ['valid' => false, 'error' => 'Please fill up all fields'];
            }
        }

        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] < 0) {
            return ['valid' => false, 'error' => 'Please input a valid amount for price'];
        }

        if (!isset($data['stock']) || !is_numeric($data['stock']) ||  $data['stock'] < 0) {
            return ['valid' => false, 'error' => 'Please input a valid amount for price'];
        }

        if (!isset($data['image']) || trim($data['image']) === '') {
            return ['valid' => false, 'error' => 'Please add an image'];
        }

        return ['valid' => true];
    }

    function isValidPet($data) {
        $requiredStrings = [
            'pet_name',
            'pet_sex',
            'pet_breed',
            'pet_type',
            'pet_description'
        ];

        foreach ($requiredStrings as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                return ['valid' => false, 'error' => 'Please fill up all fields'];
            }
        }

        if (!isset($data['pet_age'])) {
            return ['valid' => false, 'error' => 'Please input a valid value for pet age'];
        }

        if (!isset($data['image']) || trim($data['image']) === '') {
            return ['valid' => false, 'error' => 'Please add an image'];
        }

        return ['valid' => true];
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
                return ['valid' => false, 'error' => 'Please fill up all fields'];
            }
        }

        if (!isset($data['selected_pets']) || !is_array($data['selected_pets']) || count($data['selected_pets']) === 0) {
            return ['valid' => false, 'error' => 'Please add a pet to adopt'];
        }

        return ['valid' => true];
    }

?>