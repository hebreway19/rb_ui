export enum UserState {
    AWAIT_EMAIL_CONFIRMATION = "await_email_confirmation",
    AWAIT_TO_CHOOSE_ULPAN = "await_to_choose_ulpan",
    AWAIT_REVIEW_BY_ULPAN = "await_review_by_ulpan",
    AWAIT_REVIEW_FOR_ULPAN = "await_review_for_ulpan",
    REJECTED_BY_ULPAN = "rejected_by_ulpan",
    BANNED = "banned",
    DELETED = "deleted",
    ON_VACATION = "on_vacation",
    ACTIVE = "active",
    ACCESS_TO_CHANGE_INFO = "access_to_change_info",
    ANY = "any",
}