#ifndef BIG_INT_UTILS_HPP
#define BIG_INT_UTILS_HPP

#include <gmpxx.h>

template <typename T>
class BigIntUtils {
public:
    static T modExp(T base, T exp, T mod);
};

#include "BigIntUtils.tpp"

#endif // BIG_INT_UTILS_HPP