import 'dart:convert';
import 'dart:typed_data';
import 'package:pointycastle/export.dart';

class EncryptUtil{
static final String secreto = "eq#jQ_@o)l^0MDvE";
  static final Uint8List salt = utf8.encode(secreto);
  static final Uint8List key = Uint8List.fromList(salt);

  static String encryptAes(String data) {
    final cipher = PaddedBlockCipherImpl(
        PKCS7Padding(), ECBBlockCipher(AESFastEngine()));

    cipher.init(
        true,
        PaddedBlockCipherParameters<CipherParameters?, CipherParameters?>(
            KeyParameter(key), null)); // Null IV for ECB mode

    var encrypted =  cipher.process(utf8.encode(data))!;

     return base64.encode(encrypted);
  }

  static String decryptAes(Uint8List encryptedData) {
    final cipher = PaddedBlockCipherImpl(
        PKCS7Padding(), ECBBlockCipher(AESFastEngine()));

    cipher.init(
        false,
        PaddedBlockCipherParameters<CipherParameters?, CipherParameters?>(
            KeyParameter(key), null)); // Null IV for ECB mode

    var decrypted = cipher.process(encryptedData)!;

    return utf8.decode(decrypted);
  }
}