from typing import Optional, Dict


class TemplateProvider:
    def get_templates(self, cursor=None):
        raise NotImplementedError("This method should be implemented by subclasses.")

    def get_template_by_id(self, template_id: int) -> Optional[Dict]:
        pass
