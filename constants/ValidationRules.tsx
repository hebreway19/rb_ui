import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Rule } from "rc-field-form/lib/interface";
import {TFunction} from "next-i18next";

export class ValidationRules {
  public static EMAIL: Rule[] = [
    {
      required: true,
      type: "email",
    }
  ];

  public static PASSWORD: Rule[] = [
    {
      required: true,
      message: ""
    },
    {
      pattern: /(?=.*[0-9])(?=.*[!:@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!:@#$%^&*]{6,}/g
    }
  ];

  public static CONFIRM_PASSWORD: Rule[] = [
    {
      required: true
    },
    ({getFieldValue}) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("");
      }
    })
  ];

  public static EMAIL_MESSAGE = (t, email = "") => <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.email")}<br/></>;
  public static PASSWORD_MESSAGE = (t, password = "") => <>
    {password.length === 0
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.password")}<br/></>
    }
    {(password && !password.match(/(?=.*[0-9])[0-9]/g))
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.numeric_symbol_rule")} <br/></>
    }
    {(password && !password.match(/(?=.*[!:@#$%^&*])[!:@#$%^&*]/g))
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.special_symbols_ryle")} <br/></>
    }
    {(password && !password.match(/(?=.*[a-z])[a-z]/g))
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.lowercase_rule")} <br/></>
    }
    {(password && !password.match(/(?=.*[A-Z])[A-Z]/g))
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.uppercase_rule")} <br/></>
    }
    {(password && !password.match(/[0-9a-zA-Z!:@#$%^&*]{6,}/g))
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.password_min_length")} <br/></>
    }
  </>;
  public static CONFIRM_PASSWORD_MESSAGE = (t, confirmPassword = "", password = "") => <>
    {confirmPassword?.length === 0
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.confirm_password")}<br/></>
    }
    {confirmPassword !== password
     && <><CloseCircleOutlined/> {t("pages.auth.register.form.validate.confirm")}<br/></>
    }
  </>;

  public static getConfirmPassword = (t: TFunction) => {
    return [
      {
        required: true
      },
      ({getFieldValue}) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(t("pages.auth.register.form.validate.confirm"));
        }
      })
    ]
  }
}