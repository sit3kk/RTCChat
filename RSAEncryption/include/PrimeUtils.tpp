#include <stdexcept>
#include <ctime>

template <IntegerType T>
T PrimeUtils<T>::generateRandomPrime(T min, T max) {
    gmp_randclass randGen(gmp_randinit_default);
    randGen.seed(static_cast<unsigned long>(std::chrono::steady_clock::now().time_since_epoch().count()));

    T candidate;

    do {
        candidate = randGen.get_z_range(max - min + 1) + min;

        if (mpz_probab_prime_p(candidate.get_mpz_t(), 10)) {
            return candidate;
        }
    } while (true);
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