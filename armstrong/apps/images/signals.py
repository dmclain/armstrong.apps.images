from armstrong.utils.celery.tasks import async_signal

@async_signal
def generate_thumbnails(sender, instance, **kwargs):
    """
    Generates thumbnails for all settings configured by 
    ARMSTRONG_PRESETS when a model is saved.
    """
    image_attrs = []
    for field in instance._meta.fields:
        if isinstance(field, ImageField) or isinstance(field, DjangoImageField):
            image_attrs.append(field.attname)
    if not image_attrs:
        return

    for field_name in image_attrs:
        field = getattr(instance, field_name)
        if not field:
            continue

        presets = getattr(settings, 'ARMSTRONG_PRESETS', {})
        for preset in presets.keys():
            get_preset_thumbnail(field, preset)
