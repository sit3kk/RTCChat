#pragma once
#include <string>
#include <random>
#include <sstream>
#include <iomanip>

inline std::string addPadding(const std::string &message, size_t desiredMinLen) {
    std::ostringstream lengthHeader;
    lengthHeader << std::setw(8) << std::setfill('0') << message.size();

    std::string result = lengthHeader.str() + message;

    if (result.size() < desiredMinLen) {
        size_t padNeeded = desiredMinLen - result.size();

        static std::random_device rd;
        static std::mt19937 gen(rd());
        static std::uniform_int_distribution<unsigned char> dist(0, 255);

        for (size_t i = 0; i < padNeeded; i++) {
            result.push_back(static_cast<char>(dist(gen)));
        }
    }
    return result;
}


inline std::string removePadding(const std::string &padded) {
    if (padded.size() < 8) {
        throw std::runtime_error("removePadding: Padded message too short.");
    }

    std::string lengthHeader = padded.substr(0, 8);
    
    if (!std::all_of(lengthHeader.begin(), lengthHeader.end(), ::isdigit)) {
        throw std::runtime_error("removePadding: Invalid length header.");
    }

    size_t originalLen = static_cast<size_t>(std::stoul(lengthHeader));
    std::string data = padded.substr(8);

    if (data.size() < originalLen) {
        throw std::runtime_error("removePadding: Insufficient data after padding.");
    }
    return data.substr(0, originalLen);
}