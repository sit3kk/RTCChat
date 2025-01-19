cmake_minimum_required(VERSION 3.10)
project(RSAEncryption)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_path(GMP_INCLUDE_DIR gmp.h PATHS /opt/homebrew/include /usr/local/include)
find_library(GMP_LIBRARY NAMES gmp PATHS /opt/homebrew/lib /usr/local/lib)
find_library(GMPXX_LIBRARY NAMES gmpxx PATHS /opt/homebrew/lib /usr/local/lib)

if(NOT GMP_INCLUDE_DIR OR NOT GMP_LIBRARY OR NOT GMPXX_LIBRARY)
    message(FATAL_ERROR "GMP not found. Please install GMP (e.g., using Homebrew).")
endif()

include_directories(${GMP_INCLUDE_DIR})

find_package(OpenSSL REQUIRED)

include_directories(${OPENSSL_INCLUDE_DIR})

include_directories(${CMAKE_SOURCE_DIR}/include)

add_executable(RSAEncryptionTest
    src/main.cpp
    src/Base64.cpp
)

target_link_libraries(RSAEncryptionTest PRIVATE ${GMP_LIBRARY} ${GMPXX_LIBRARY} ${OPENSSL_LIBRARIES})

target_link_options(RSAEncryptionTest PRIVATE "-L/opt/homebrew/lib")