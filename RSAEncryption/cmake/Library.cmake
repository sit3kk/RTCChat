# cmake/Library.cmake

add_library(RSAEncryptionLibrary
    ${CMAKE_SOURCE_DIR}/src/Base64.cpp
)

target_link_libraries(RSAEncryptionLibrary PRIVATE
    ${GMP_LIBRARY}
    ${GMPXX_LIBRARY}
    OpenSSL::Crypto
)

target_compile_options(RSAEncryptionLibrary PRIVATE
    ${OPTIMIZATION_FLAGS}
)

target_include_directories(RSAEncryptionLibrary PRIVATE
    ${OPENSSL_INCLUDE_DIR}
)