#pragma once

#include <string>
#include <utility>

std::string exportPGPMessage(const std::string &message);

template <typename T>
std::string exportPGPPublicKey(const std::pair<T, T> &publicKey);

template <typename T>
std::string exportPGPPrivateKey(const std::pair<T, T> &privateKey);

#include "PGPFormatter.tpp"