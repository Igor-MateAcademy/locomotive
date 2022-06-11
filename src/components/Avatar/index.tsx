import React, { useState, useEffect } from 'react';
import { Avatar as AntAvatar, AvatarProps } from 'antd';
import stringToColor from 'string-to-color';

interface Props extends AvatarProps {
  firstName: string;
  lastName: string;
}

const Avatar: React.FC<Props> = ({ firstName, lastName, ...props }) => {
  const [altName, setAltName] = useState<string>();
  const [color, setColor] = useState<string>('#cccccc');

  const onError = () => {
    const initials = firstName && lastName
      ? (firstName[0] + lastName[0]).toUpperCase()
      : '?';

    setAltName(initials);
    setColor(stringToColor(initials));

    return false;
  };

  useEffect(() => {
    if (!props.src && !props.src) onError();
  }, []);

  return (
    <AntAvatar {...props} src={undefined} srcSet={undefined} style={{ backgroundColor: color }}>
      {altName}
    </AntAvatar>
  );
};

export default Avatar;
