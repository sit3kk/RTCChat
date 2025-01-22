add_executable(RSAEncryption
    ${CMAKE_SOURCE_DIR}/src/main.cpp
    ${CMAKE_SOURCE_DIR}/src/Base64.cpp
)

target_link_libraries(RSAEncryption PRIVATE
    ${GMP_LIBRARY}
    ${GMPXX_LIBRARY}
    OpenSSL::Crypto
)

target_compile_options(RSAEncryption PRIVATE
    ${OPTIMIZATION_FLAGS}
)

target_include_directories(RSAEncryption PRIVATE
    ${OPENSSL_INCLUDE_DIR}
)