import os

import requests

URL = f"https://vrchat.com/api/1/users/{os.environ['VRCHAT_USER_ID']}"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
}

COOKIES = {
    "auth": os.environ["VRCHAT_AUTH"],
    "twoFactorAuth": os.environ["VRCHAT_TWO_FACTOR_AUTH"],
}

raw_profile = requests.get(URL, headers=HEADERS, cookies=COOKIES).json()

data = {
    "status": raw_profile["status"],
    "statusDescription": "にゃーん",  # raw_profile["statusDescription"],
    "bio": raw_profile["bio"],
    "bioLinks": raw_profile["bioLinks"],
    "pronouns": raw_profile["pronouns"],
}

print(data)

response = requests.put(URL, json=data, headers=HEADERS, cookies=COOKIES)
print(response.status_code)
if response.status_code == 200:
    print(response.content)
