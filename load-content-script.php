<?php
    $pets = require 'pets.php';
    $products = require 'products.php';

    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    foreach ($pets as $pet) {

        $oldPath = $pet['image'];
        $extension = pathinfo($oldPath, PATHINFO_EXTENSION);

        $fileName = uniqid('pet_', true) . '.' . $extension;
        $newPath = $uploadDir . $fileName;

        copy($oldPath, $newPath);

        $pet_data = [
            'pet_name' => $pet['name'],
            'pet_age' => $pet['age'],
            'pet_sex' => $pet['sex'],
            'pet_breed' => $pet['breed'],
            'pet_type' => $pet['type'],
            'pet_description' => $pet['description'],
            'image' => $newPath
        ];

        $result = $db->add_pet($pet_data);
    }

    foreach ($products as $product) {
        $oldPath = $product['image'];
        $extension = pathinfo($oldPath, PATHINFO_EXTENSION);
        $fileName = uniqid('product_', true) . '.' . $extension;
        $newPath = $uploadDir . $fileName;

        copy($oldPath, $newPath);

        $product_data = [
            'product_name' => $product['name'],
            'description' => $product['description'],
            'category' => $product['category'],
            'pet_type' => $product['type'],
            'price' => $product['price'],
            'stock' => $product['stock'],
            'image' => $newPath
        ];

        $result = $db->add_product($product_data);
    }

?>