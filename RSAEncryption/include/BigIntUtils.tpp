#pragma once

#include "BigIntUtils.hpp"

template <typename T>
T BigIntUtils<T>::modExp(T base, T exp, T mod) {
    T result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1) {
            result = (result * base) % mod;
        }
        exp = exp >> 1;
        base = (base * base) % mod;
    }
    return result;
}

template <>
mpz_class BigIntUtils<mpz_class>::modExp(mpz_class base, mpz_class exp, mpz_class mod) {
    mpz_class result;
    mpz_powm(result.get_mpz_t(), base.get_mpz_t(), exp.get_mpz_t(), mod.get_mpz_t());
    return result;
}