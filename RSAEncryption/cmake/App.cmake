# cmake/App.cmake

add_executable(RSAEncryption
    ${CMAKE_SOURCE_DIR}/src/main.cpp
    ${CMAKE_SOURCE_DIR}/src/Base64.cpp
)

target_link_libraries(RSAEncryption PRIVATE
    ${GMP_LIBRARY}
    ${GMPXX_LIBRARY}
    OpenSSL::Crypto  # lub OpenSSL::SSL, jeżeli potrzebujesz SSL
)

target_compile_options(RSAEncryption PRIVATE
    ${OPTIMIZATION_FLAGS}
)

target_include_directories(RSAEncryption PRIVATE
    ${OPENSSL_INCLUDE_DIR}
)