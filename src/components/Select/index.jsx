import { Select as BaseSelect } from "antd";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "./Select.module.scss";

const Select = ({
  children,
  fullWidth,
  isConfigs,
  classNameOption,
  onClickOption,
  wrapperClassName,
  mode,
  classNameMultiIcon,
  className,
  iconVertical,
  allowClear,
  ...rest
}) => {
  const wrapperID = useMemo(() => uuidv4(), []);
  return (
    <div
      className={clsx(styles.bisoSelect, wrapperClassName)}
      id={wrapperID}
      {...(fullWidth ? { style: { width: "100%" } } : {})}
    >
      <BaseSelect
        showSearch
        allowClear={allowClear}
        filterOption={(search, item) =>
          item?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) >= 0
        }
        getPopupContainer={() => document.getElementById(wrapperID)}
        className={clsx(className, isConfigs && styles.selectWithConfigs)}
        mode={mode}
        {...(fullWidth ? { style: { width: "100%" } } : {})}
        {...rest}
      >
        {children}
      </BaseSelect>
    </div>
  );
};

Select.propTypes = {
  mode: PropTypes.string,
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  isConfigs: PropTypes.bool,
  iconVertical: PropTypes.bool,
  allowClear: PropTypes.bool,
  classNameOption: PropTypes.string,
  onClickOption: PropTypes.func,
  wrapperClassName: PropTypes.string,
  classNameMultiIcon: PropTypes.string,
};
Select.defaultProps = {
  mode: "",
  children: null,
  fullWidth: false,
  isConfigs: false,
  iconVertical: false,
  allowClear: true,
  classNameOption: "",
  onClickOption: () => {},
  wrapperClassName: "",
  classNameMultiIcon: "",
};

Select.Option = BaseSelect.Option;
Select.OptGroup = BaseSelect.OptGroup;

export default Select;
