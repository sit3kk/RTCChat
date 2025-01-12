#ifndef HASH_UTILS_HPP
#define HASH_UTILS_HPP

#include <string>

class HashUtils {
public:
    static std::string sha256(const std::string& input);
};

#endif // HASH_UTILS_HPP