#ifndef BASE64_HPP
#define BASE64_HPP

#include <string>
#include <vector>

class Base64 {
public:
    static std::string encode(const std::vector<uint8_t>& data);
};

#endif // BASE64_HPP