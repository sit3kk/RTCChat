# RSA Cryptography Library Documentation

## **Overview**

This project implements RSA cryptography, including key generation, encryption, decryption, and digital signatures. It is built using modern C++ features such as templates and concepts, with external libraries like GMP for handling large integers and nlohmann::json for JSON support.

---

## **Features**

- **Key Generation**: Generate public and private RSA keys using large prime numbers.
- **Encryption and Decryption**: Securely encrypt and decrypt messages using RSA.
- **Digital Signatures**: Generate and verify signatures for data integrity and authentication.
- **Key and Signature Export**: Export and import keys and signatures in PGP and JSON formats.
- **Certificates**: Manage RSA certificates associating public keys with owners.

---

## **File Structure and Explanation**

### **1. RSAKeyGenerator**

**Purpose**: Generates RSA public and private key pairs.

#### Functions:

- **`generateKeys(T minPrime, T maxPrime)`**

  - Generates two distinct large prime numbers \( p \) and \( q \) within the range.
  - Computes:
    - \( n = p \times q \)
    - \( \phi(n) = (p - 1) \times (q - 1) \)
    - Public key: \( e = 65537 \)
    - Private key: \( d = e^{-1} \mod \phi(n) \)
  - **Templates**: Enables flexibility in the type of numbers used (e.g., `mpz_class`, `Boost::cpp_int`).
  - **Concepts**: Ensures the type supports modular arithmetic and basic number operations.

- **`importPublicKeyFromJSON(const std::string& json)`**

  - Parses a JSON string and extracts the public key \( (e, n) \).

- **`importPrivateKeyFromJSON(const std::string& json)`**
  - Parses a JSON string and extracts the private key \( (d, n) \).

---

### **2. RSAEncryptor**

**Purpose**: Encrypts and decrypts messages using RSA.

#### Functions:

- **`encryptMessage(const std::string& message, T e, T n)`**

  - Divides the message into blocks and encrypts each using \( c = m^e \mod n \).
  - Applies PKCS#1 padding for security.
  - **Templates**: Ensures compatibility with various numerical types.

- **`decryptMessage(const std::vector<T>& encryptedBlocks, T d, T n)`**

  - Decrypts each block using \( m = c^d \mod n \).
  - Validates and removes PKCS#1 padding.

- **`generateSignature(const std::string& message, T privateKey, T n)`**

  - Computes a hash of the message and signs it using \( s = h^d \mod n \).
  - **Concepts**: Ensures the type supports modular arithmetic.

- **`verifySignature(T signature, const std::string& message, T publicKey, T n)`**
  - Verifies the signature using \( h' = s^e \mod n \) and compares it to the hash of the message.

---

### **3. RSAKeyExporter**

**Purpose**: Exports keys in PGP or JSON formats.

#### Functions:

- **`exportKey(const std::pair<T, T>& key)`**

  - Exports a key as a string in the specified format.
  - **Templates**: Supports different formats (`PGPFormat`, `JSONFormat`).

- **`exportPublicKey(const std::pair<T, T>& publicKey)`**

  - Exports the public key.

- **`exportPrivateKey(const std::pair<T, T>& privateKey)`**
  - Exports the private key.

---

### **4. RSASignatureManager**

**Purpose**: Manages digital signatures.

#### Functions:

- **`exportSignature(const T& signature, const std::string& message)`**

  - Exports a signature and its corresponding message in PGP or JSON format.
  - **Templates**: Allows multiple formats.

- **`importSignature(const std::string& encodedSignature)`**
  - Parses the encoded signature and extracts the signature and message.

---

### **5. RSACertificateManager**

**Purpose**: Handles RSA certificates that bind a public key to an owner.

#### Functions:

- **`exportCertificate<Format>()`**

  - Exports the certificate in a specified format (PGP or JSON).

- **`importCertificate<Format>(const std::string& certificate)`**
  - Imports a certificate from a string.

---

### **6. Base64**

**Purpose**: Provides Base64 encoding and decoding.

#### Functions:

- **`encode(const std::vector<uint8_t>& data)`**
  - Encodes binary data to a Base64 string.
- **`decode(const std::string& encoded)`**
  - Decodes a Base64 string to binary data.

---

### **7. PrimeUtils**

**Purpose**: Utilities for working with prime numbers.

#### Functions:

- **`generateRandomPrime(T min, T max)`**
  - Generates a random prime number within a range.
- **`gcd(T a, T b)`**
  - Computes the greatest common divisor of \( a \) and \( b \).
- **`modInverse(T a, T mod)`**
  - Computes the modular inverse of \( a \) modulo \( mod \).

---

## **Justification of Tools and Libraries**

### **Templates**

- **Why?**
  - Templates allow the implementation to be generic and reusable for various numerical types.
  - They provide flexibility to extend the library to work with custom types in the future.
- **Example:** `RSAEncryptor<T>` can use `mpz_class`, `Boost::cpp_int`, or other types for large numbers.

---

### **Concepts**

- **Why?**
  - Concepts ensure that only types meeting specific requirements (e.g., modular arithmetic, basic operators) can be used with templates.
  - Improves code clarity and prevents misuse at compile-time.
- **Example:** The `Encryptable` concept ensures the type supports `%`, `/`, and modular exponentiation.

---

### **GMP Library**

- **Why?**
  - GMP is optimized for large integer arithmetic, which is critical for RSA cryptography.
  - Provides efficient implementations for operations like modular exponentiation and prime testing.
- **Example:** `mpz_class` handles numbers with hundreds or thousands of bits, far exceeding standard C++ types.

---

### **STL**

- **Why?**
  - The Standard Template Library simplifies operations like string manipulation (`std::string`), dynamic arrays (`std::vector`), and JSON parsing.
- **Example:** `std::pair` is used to represent public and private keys.

---

### **nlohmann::json**

- **Why?**
  - Simplifies JSON parsing and serialization for exporting and importing keys and signatures.
- **Example:** `RSAKeyExporter` uses this library to format keys in JSON.
