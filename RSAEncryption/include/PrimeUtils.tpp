#include <stdexcept>
#include <ctime>

template <IntegerType T>
bool PrimeUtils<T>::isPrime(T num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 == 0 || num % 3 == 0) return false;

    T i = 5;
    while (i * i <= num) {
        if (num % i == 0 || num % (i + 2) == 0) return false;
        i += 6;
    }
    return true;
}

template <IntegerType T>
T PrimeUtils<T>::generateRandomPrime(T min, T max) {
    T candidate;
    gmp_randclass randGen(gmp_randinit_default);
    randGen.seed(static_cast<unsigned long>(time(nullptr)));

    do {
        candidate = randGen.get_z_range(max - min + 1) + min;
    } while (!isPrime(candidate));

    return candidate;
}

template <IntegerType T>
T PrimeUtils<T>::gcd(T a, T b) {
    while (b != 0) {
        T temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

template <IntegerType T>
T PrimeUtils<T>::modInverse(T e, T phi) {
    T result;
    if (mpz_invert(result.get_mpz_t(), e.get_mpz_t(), phi.get_mpz_t()) == 0) {
        throw std::runtime_error("Modular inverse does not exist");
    }
    return result;
}