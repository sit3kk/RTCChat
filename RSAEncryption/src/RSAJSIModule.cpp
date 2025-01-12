#include <jsi/jsi.h>
#include <string>
#include "rsa_module.cpp"

using namespace facebook;

class RSAJSIModule : public jsi::HostObject {
public:
    jsi::Value generateKeys(jsi::Runtime& runtime, const jsi::Value* args, size_t count) {
        int keySize = args[0].asNumber();
        const char* result = generateKeys(keySize);
        return jsi::String::createFromUtf8(runtime, result);
    }

    jsi::Value encrypt(jsi::Runtime& runtime, const jsi::Value* args, size_t count) {
        std::string message = args[0].asString(runtime).utf8(runtime);
        std::string publicKey = args[1].asString(runtime).utf8(runtime);
        const char* result = encryptMessage(message.c_str(), publicKey.c_str());
        return jsi::String::createFromUtf8(runtime, result);
    }

    jsi::Value decrypt(jsi::Runtime& runtime, const jsi::Value* args, size_t count) {
        std::string encryptedMessage = args[0].asString(runtime).utf8(runtime);
        std::string privateKey = args[1].asString(runtime).utf8(runtime);
        const char* result = decryptMessage(encryptedMessage.c_str(), privateKey.c_str());
        return jsi::String::createFromUtf8(runtime, result);
    }
};