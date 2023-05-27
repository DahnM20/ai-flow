class ProcessorStore:
    def get(self, key):
        raise NotImplementedError()

    def set(self, key, value):
        raise NotImplementedError()

class LocalProcessorStore(ProcessorStore):
    def __init__(self):
        self.store = dict()

    def get(self, key):
        return self.store.get(key)

    def set(self, key, value):
        self.store[key] = value

class RedisProcessorStore(ProcessorStore):
    def __init__(self):
        self.store = redis.Redis(host='localhost', port=6379, db=0)

    def get(self, key):
        value = self.store.get(key)
        return pickle.loads(value) if value else None

    def set(self, key, value):
        self.store.set(key, pickle.dumps(value))

class ProcessorStoreFactory:
    def __init__(self, mode):
        self.mode = mode

    def create_store(self):
        if self.mode == 'local':
            return LocalProcessorStore()
        elif self.mode == 'prod':
            return RedisProcessorStore()
        else:
            raise ValueError("Invalid mode")