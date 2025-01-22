#ifndef PRIME_UTILS_HPP
#define PRIME_UTILS_HPP

#include <gmpxx.h>

template <typename T>
concept IntegerType = requires(T a, T b) {
    { a % b } -> std::convertible_to<T>;
    { a / b } -> std::convertible_to<T>;
    { a > b } -> std::convertible_to<bool>;
};

template <IntegerType T>
class PrimeUtils {
public:
    static bool isPrime(T num);
    static T generateRandomPrime(T min, T max);
    static T gcd(T a, T b);
    static T modInverse(T e, T phi);
};

#include "PrimeUtils.tpp"

#endif // PRIME_UTILS_HPP