package cloudcode.helloworld.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/** Defines a controller to handle HTTP requests */
@Controller
public final class HelloWorldController {

  /**
   * Create an endpoint for the landing page
   *
   * @return the index view template
   */
  @GetMapping("/")
  public String helloWorld(Model model) {

    // Get Cloud Run environment variables.
    String revision = System.getenv("K_REVISION") == null ? "???" : System.getenv("K_REVISION");
    String service = System.getenv("K_SERVICE") == null ? "???" : System.getenv("K_SERVICE");

    // Set variables in html template.
    model.addAttribute("revision", revision);
    model.addAttribute("service", service);
    return "index";
  }

  @RequestMapping("/signup")
  public String signUp() {
    return "signup";
  }

  @RequestMapping("/pages/recipe-detail")
  public String recipe() {
    return "pages/recipe-detail/index";
  }

  @RequestMapping("/pages/explore-page")
  public String homePage() {
    return "pages/explore-page/index";
  }

  @RequestMapping("/pages/create-recipe-form")
  public String createRecipeForm() {
    return "pages/create-recipe-form/index";
  }

  @RequestMapping("/pages/edit-recipe-form")
  public String editRecipeForm() {
    return "pages/edit-recipe-form/index";
  }
}
