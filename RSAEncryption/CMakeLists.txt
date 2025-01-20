cmake_minimum_required(VERSION 3.10)
project(RSAEncryption)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set(OPTIMIZATION_FLAGS "-O3" "-march=native" "-funroll-loops")

set(GMP_INCLUDE_DIR "/opt/homebrew/include")
set(GMP_LIBRARY "/opt/homebrew/lib/libgmp.dylib")
set(GMPXX_LIBRARY "/opt/homebrew/lib/libgmpxx.dylib")

if(NOT EXISTS "${GMP_LIBRARY}" OR NOT EXISTS "${GMPXX_LIBRARY}" OR NOT IS_DIRECTORY "${GMP_INCLUDE_DIR}")
    message(FATAL_ERROR "Nie znaleziono GMP w podanych ścieżkach. Zainstaluj GMP lub zaktualizuj GMP_INCLUDE_DIR/GMP_LIBRARY/GMPXX_LIBRARY.")
endif()


include_directories(${GMP_INCLUDE_DIR})
include_directories("${CMAKE_SOURCE_DIR}/include")

find_package(OpenSSL REQUIRED)

find_package(GTest REQUIRED)

enable_testing()

include(${CMAKE_SOURCE_DIR}/cmake/App.cmake)
include(${CMAKE_SOURCE_DIR}/cmake/Library.cmake)
include(${CMAKE_SOURCE_DIR}/cmake/Tests.cmake)