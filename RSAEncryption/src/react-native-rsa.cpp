#include <jsi/jsi.h>
#include "RSAJSIModule.cpp"

using namespace facebook;

extern "C" void install(jsi::Runtime& runtime) {
    auto module = std::make_shared<RSAJSIModule>();
    runtime.global().setProperty(
        runtime,
        jsi::String::createFromUtf8(runtime, "RSA"),
        jsi::Object::createFromHostObject(runtime, module)
    );
}