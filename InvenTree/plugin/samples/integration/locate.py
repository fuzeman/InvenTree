"""
Sample plugin for locating stock items / locations.

Note: This plugin does not *actually* locate anything!
"""

import logging

from plugin import IntegrationPluginBase
from plugin.mixins import LocateMixin


logger = logging.getLogger('inventree')


class SampleLocatePlugin(LocateMixin, IntegrationPluginBase):

    PLUGIN_NAME = "SampleLocatePlugin"
    PLUGIN_SLUG = "samplelocate",
    PLUGIN_TITLE = "Sample plugin for locating items"

    VERSION = "0.1"

    def locate_stock_location(self, location_pk):

        from stock.models import StockLocation

        logger.info(f"SampleLocatePlugin attempting to locate location ID {location_pk}")

        try:
            location = StockLocation.objects.get(pk=location_pk)
            logger.info(f"Location exists at '{location.pathstring}'")
        except StockLocation.DoesNotExist:
            logger.error(f"Location ID {location_pk} does not exist!")
