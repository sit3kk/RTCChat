set(LIBRARY_TYPE "STATIC" CACHE STRING "Type of library: STATIC, SHARED or MODULE")
set_property(CACHE LIBRARY_TYPE PROPERTY STRINGS STATIC SHARED MODULE)

add_library(RSAEncryptionLibrary ${LIBRARY_TYPE}
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
    ${CMAKE_SOURCE_DIR}/include
)

if(CMAKE_SYSTEM_NAME STREQUAL "iOS")
    set_target_properties(RSAEncryptionLibrary PROPERTIES
        FRAMEWORK TRUE
        FRAMEWORK_VERSION A
    )
endif()