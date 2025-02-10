"""Gunicorn configuration for InvenTree."""

import logging
import multiprocessing
import os


def get_int(name, default_value=None):
    """Parse integer from environment variable or return default."""
    value = os.environ.get(name, None)

    if value is None:
        return default_value

    try:
        return int(value)
    except ValueError:
        return default_value


# Logger configuration
logger = logging.getLogger('inventree')
accesslog = '-'
errorlog = '-'
loglevel = os.environ.get('INVENTREE_LOG_LEVEL', 'warning').lower()
capture_output = True

# Worker configuration
#  TODO: Implement support for gevent
# worker_class = 'gevent'  # Allow multi-threading support
worker_tmp_dir = '/dev/shm'  # Write temp file to RAM (faster)
threads = 4

# Worker timeout (default = 90 seconds)
timeout = get_int('INVENTREE_GUNICORN_TIMEOUT', 90)

# Number of worker processes
workers = get_int('INVENTREE_GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1)

logger.info('Starting gunicorn server with %s workers', workers)

# Maximum Requests
max_requests = get_int('INVENTREE_GUNICORN_MAX_REQUESTS', 1000)
max_requests_jitter = get_int('INVENTREE_GUNICORN_MAX_REQUESTS_JITTER', 50)

# preload app so that the ready functions are only executed once
preload_app = True
