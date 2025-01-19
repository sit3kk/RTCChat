#ifndef BIGINT_UTILS_TPP
#define BIGINT_UTILS_TPP

#include "BigIntUtils.hpp"

// Implementation of BigIntUtils
template <ModularType T>
T BigIntUtils<T>::modExp(T base, T exp, T mod) {
    T result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1) {  // if odd exponent
            result = (result * base) % mod;
        }
        exp >>= 1;
        base = (base * base) % mod;
    }
    return result;
}

#endif // BIGINT_UTILS_TPP