#ifndef BIGINT_UTILS_TPP
#define BIGINT_UTILS_TPP

#include "BigIntUtils.hpp"

template <ModularType T>
T BigIntUtils<T>::modExp(T base, T exp, T mod) {
    if (mod == 0) {
        throw std::invalid_argument("Modulus cannot be zero.");
    }

    T result = 1;     
    base = base % mod;    

    while (exp > 0) {
        if (exp % 2 == 1) { 
            result = (result * base) % mod;
        }
        exp >>= 1;         
        base = (base * base) % mod;
    }

    return result;
}

template <>
mpz_class BigIntUtils<mpz_class>::modExp(mpz_class base, mpz_class exp, mpz_class mod) {
    if (mod == 0) {
        throw std::invalid_argument("Modulus cannot be zero.");
    }

    mpz_class result;
    mpz_powm_sec(result.get_mpz_t(), base.get_mpz_t(), exp.get_mpz_t(), mod.get_mpz_t());
    return result;
}

template <ModularType T>
T BigIntUtils<T>::modInverse(T a, T mod) {
    if (mod == 0) {
        throw std::invalid_argument("Modulus cannot be zero.");
    }

    T result;
    if (mpz_invert(result.get_mpz_t(), a.get_mpz_t(), mod.get_mpz_t()) == 0) {
        throw std::runtime_error("Modular inverse does not exist");
    }

    return result;
}

#endif // BIGINT_UTILS_TPP

