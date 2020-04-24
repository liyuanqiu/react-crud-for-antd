import { notification } from 'antd';
import React, { useEffect } from 'react';

export function notifyError(error: Error) {
  notification.error({
    key: 'ErrorKey',
    message: error.name,
    description: (
      <div
        style={{
          maxHeight: 300,
          overflow: 'scroll',
        }}
      >
        {error.message}
      </div>
    ),
  });
}

export function useErrorNotification(error?: Error) {
  useEffect(() => {
    if (error !== undefined) {
      notifyError(error);
    }
  }, [error]);
}
