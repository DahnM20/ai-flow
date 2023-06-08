from .processor_store import ProcessorStoreFactory


class SingletonStore:
    def __init__(self, cls):
        self._cls = cls
        self._instance = None

    def __call__(self, *args, **kwargs):
        if self._instance is None:
            self._instance = self._cls(*args, **kwargs)
        return self._instance

@SingletonStore
class ProcessorStoreSingleton:
    def __init__(self):
        factory = ProcessorStoreFactory('local')
        self.store = factory.create_store()

