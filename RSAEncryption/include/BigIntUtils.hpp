#ifndef BIGINT_UTILS_HPP
#define BIGINT_UTILS_HPP

#include <concepts>

// Concept for modular arithmetic
template <typename T>
concept ModularType = requires(T a, T b, T c) {
    { a % b } -> std::convertible_to<T>;
    { a * b } -> std::convertible_to<T>;
    { a / b } -> std::convertible_to<T>;
    { a - b } -> std::convertible_to<T>;
    { a + b } -> std::convertible_to<T>;
};

// Declaration of BigIntUtils with concept validation
template <ModularType T>
class BigIntUtils {
public:
    static T modExp(T base, T exp, T mod);
};

#include "BigIntUtils.tpp"

#endif // BIGINT_UTILS_HPP