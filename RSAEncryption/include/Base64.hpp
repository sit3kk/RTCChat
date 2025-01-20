#ifndef BASE64_HPP
#define BASE64_HPP

#include <string>
#include <vector>

class Base64 {
public:
    static std::string encode(const std::vector<uint8_t>& data);
    static std::vector<uint8_t> decode(const std::string& encoded);
};

#endif // BASE64_HPP