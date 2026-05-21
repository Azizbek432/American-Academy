const form = document.getElementById("lead-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const phoneInput = document.getElementById("phone").value.trim();
  const nameInput = document.getElementById("name").value.trim();

  if (phoneInput.length < 13) {
    alert(
      "Iltimos, telefon raqamingizni to'liq kiriting! (Masalan: +998991234567)",
    );
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      alert(
        `Rahmat, ${nameInput}! Arizangiz muvaffaqiyatli qabul qilindi. Tez orada American Academy administratorlari siz bilan bog'lanishadi.`,
      );
      form.reset();
      document.getElementById("phone").value = "+998";
    } else {
      alert("Xatolik yuz berdi. Iltimos, formani qaytadan to'ldirib ko'ring.");
    }
  } catch (error) {
    alert("Internet aloqasini tekshiring va qaytadan urining.");
  }
});

document.getElementById("phone").addEventListener("input", function (e) {
  if (!this.value.startsWith("+998")) {
    this.value = "+998";
  }
});
