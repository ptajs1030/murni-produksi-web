<?php

namespace App\Enums;

enum StatusCode: int
{
    case SUCCESS = 1;
    case DATA_NOT_FOUND = 2;
    case DUPLICATE_DATA = 3;
    case API_KEY_INVALID = 4;
    case EMPTY_FIELD = 5;
    case NOT_CONNECT_FTP = 6;
    case NOT_DOWNLOAD_FTP = 7;
    case PROJECT_INVALID = 8;
    case USER_INVALID = 9;
    case ACCESS_TOKEN_INVALID = 10;
    case NOT_UPLOAD_FTP = 11;
    case FIELD_REQUIREMENT_INVALID = 12;

    public function description(string $lang = 'id'): string
    {
        return match ($this) {
            self::SUCCESS => __('status.success'),
            self::DATA_NOT_FOUND => __('status.data_not_found'),
            self::DUPLICATE_DATA => __('status.duplicate_data'),
            self::API_KEY_INVALID => __('status.api_key_invalid'),
            self::EMPTY_FIELD => __('status.empty_field'),
            self::NOT_CONNECT_FTP => __('status.not_connect_ftp'),
            self::NOT_DOWNLOAD_FTP => __('status.not_download_ftp'),
            self::PROJECT_INVALID => __('status.project_invalid'),
            self::USER_INVALID => __('status.user_invalid'),
            self::ACCESS_TOKEN_INVALID => __('status.access_token_invalid'),
            self::NOT_UPLOAD_FTP => __('status.not_upload_ftp'),
            self::FIELD_REQUIREMENT_INVALID => __('status.invalid_field'),
        };
    }

    public function toArray(): array
    {
        return [
            'code' => $this->value,
            'description' => $this->description(),
        ];
    }
}
