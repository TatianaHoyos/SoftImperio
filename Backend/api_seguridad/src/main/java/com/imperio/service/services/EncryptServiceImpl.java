package com.imperio.service.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import java.security.MessageDigest;
import java.util.Base64;

@Service
public class EncryptServiceImpl implements EncryptService {

    private static final String ALGORITHM_SHA = "SHA-256";
    private static final String ALGORITHM_AES = "AES";

    @Value("${security.crypto.salt}")
    private String salt;

    @Override
    public String encryptPassword(String password) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        // Crea una clave secreta a partir del secreto
        SecretKey key = new SecretKeySpec(salt.getBytes(), ALGORITHM_AES);

        Cipher cipher = Cipher.getInstance(ALGORITHM_AES);
        cipher.init(Cipher.ENCRYPT_MODE, key);

        byte[] encryptedBytes = cipher.doFinal(password.getBytes());

        // Convertir la salida a Base64
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }


        public String decryptPassword(String password) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
            //Crea una clave secreta a partir del secreto
            SecretKey key = new SecretKeySpec(salt.getBytes(), ALGORITHM_AES);

            Cipher cipher = Cipher.getInstance(ALGORITHM_AES);
            cipher.init(Cipher.DECRYPT_MODE, key);

            // Decodificar el texto encriptado de Base64
            byte[] encryptedBytes = Base64.getDecoder().decode(password);

            byte[] decryptedBytes = cipher.doFinal(encryptedBytes);

            // Convertir la salida de bytes a String
            return new String(decryptedBytes);
        }

    @Override
    public String createHash(String password) throws NoSuchAlgorithmException {
        // Crea un objeto MessageDigest para el algoritmo SHA-256
        MessageDigest digest = MessageDigest.getInstance(ALGORITHM_SHA);

        // Encripta el texto
        byte[] bytes = digest.digest(password.getBytes(StandardCharsets.UTF_8));

        // Devuelve el hash en hexadecimal
        return bytesToHex(bytes);
    }

    @Override
    public boolean verifyHash(String originalPassword, String hashPassword) throws NoSuchAlgorithmException {
        // Crea un objeto MessageDigest para el algoritmo SHA-256
        MessageDigest digest = MessageDigest.getInstance(ALGORITHM_SHA);

        // Encripta el texto
        byte[] bytes = digest.digest(originalPassword.getBytes(StandardCharsets.UTF_8));

        // Devuelve true si los hash coinciden
        return bytesToHex(bytes).equals(hashPassword);
    }


    private static String bytesToHex(byte[] bytes) {
        // Convierte los bytes a un string hexadecimal
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
