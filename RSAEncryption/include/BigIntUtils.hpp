#ifndef BIGINT_UTILS_HPP
#define BIGINT_UTILS_HPP

#include <concepts>

template <typename T>
concept ModularType = requires(T a, T b) {
    { a % b };
    { a * b };
    { a / b };
};


template <ModularType T>
class BigIntUtils {
public:
    static T modExp(T base, T exp, T mod);
    static T modInverse(T a, T mod);
};



#include "BigIntUtils.tpp"

#endif // BIGINT_UTILS_HPP

