/*
    =========================================
    오늘의 루틴 연구소 메인 페이지 JavaScript
    =========================================
    이 파일은 페이지를 '동적인 페이지'로 만들기 위한 기능을 담당한다.

    포함 기능
    1) 회원가입 폼 validation 검사
    2) 로그인 폼 validation 검사
    3) '로봇이 아닙니다' 체크 확인
    4) 검색어에 따라 해당 섹션 안내 및 이동
    5) 다크모드 전환
    6) 루틴 플래너 항목 추가 및 완료 처리
    7) 고객지원 FAQ 열기/닫기
*/

// HTML 문서가 모두 로드된 뒤에 JavaScript가 실행되도록 설정
window.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const searchResult = document.getElementById("searchResult");
    const themeToggle = document.getElementById("themeToggle");
    const addTodoBtn = document.getElementById("addTodoBtn");
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const todoStatus = document.getElementById("todoStatus");
    const faqQuestions = document.querySelectorAll(".faq-question");

    // =========================
    // 공통 함수: 에러 메시지 출력
    // =========================
    function showError(inputId, errorId, message) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.add("input-error");
        input.classList.remove("input-success");
        error.textContent = message;
    }

    // =========================
    // 공통 함수: 성공 상태 표시
    // =========================
    function showSuccess(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.remove("input-error");
        input.classList.add("input-success");
        error.textContent = "";
    }

    // =========================
    // 회원가입 유효성 검사
    // =========================
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const userid = document.getElementById("userid").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const interest = document.getElementById("interest").value;
        const agree = document.getElementById("agree").checked;

        const useridPattern = /^[a-zA-Z0-9]{4,12}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        const phonePattern = /^01[016789]-\d{3,4}-\d{4}$/;

        if (name.length < 2) {
            showError("name", "nameError", "이름은 2자 이상 입력해야 합니다.");
            isValid = false;
        } else {
            showSuccess("name", "nameError");
        }

        if (!useridPattern.test(userid)) {
            showError("userid", "useridError", "아이디는 영문/숫자 4~12자로 입력해야 합니다.");
            isValid = false;
        } else {
            showSuccess("userid", "useridError");
        }

        if (!emailPattern.test(email)) {
            showError("email", "emailError", "올바른 이메일 형식으로 입력해주세요.");
            isValid = false;
        } else {
            showSuccess("email", "emailError");
        }

        if (!passwordPattern.test(password)) {
            showError("password", "passwordError", "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다.");
            isValid = false;
        } else {
            showSuccess("password", "passwordError");
        }

        if (confirmPassword === "" || confirmPassword !== password) {
            showError("confirmPassword", "confirmPasswordError", "비밀번호 확인이 일치하지 않습니다.");
            isValid = false;
        } else {
            showSuccess("confirmPassword", "confirmPasswordError");
        }

        if (!phonePattern.test(phone)) {
            showError("phone", "phoneError", "전화번호는 010-1234-5678 형식으로 입력해주세요.");
            isValid = false;
        } else {
            showSuccess("phone", "phoneError");
        }

        if (interest === "") {
            document.getElementById("interestError").textContent = "관심 분야를 선택해주세요.";
            isValid = false;
        } else {
            document.getElementById("interestError").textContent = "";
        }

        if (!agree) {
            document.getElementById("agreeError").textContent = "개인정보 이용 동의가 필요합니다.";
            isValid = false;
        } else {
            document.getElementById("agreeError").textContent = "";
        }

        if (isValid) {
            alert("회원가입이 정상적으로 완료되었습니다!");
            signupForm.reset();
            document.querySelectorAll("#signupForm input, #signupForm select").forEach(function (el) {
                el.classList.remove("input-success");
            });
        }
    });

    // =========================
    // 로그인 유효성 검사
    // =========================
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;
        const loginId = document.getElementById("loginId").value.trim();
        const loginPassword = document.getElementById("loginPassword").value.trim();
        const robotCheck = document.getElementById("robotCheck").checked;

        if (loginId.length < 4) {
            showError("loginId", "loginIdError", "아이디는 4자 이상 입력해주세요.");
            isValid = false;
        } else {
            showSuccess("loginId", "loginIdError");
        }

        if (loginPassword.length < 8) {
            showError("loginPassword", "loginPasswordError", "비밀번호는 8자 이상 입력해주세요.");
            isValid = false;
        } else {
            showSuccess("loginPassword", "loginPasswordError");
        }

        if (!robotCheck) {
            document.getElementById("robotCheckError").textContent = "'로봇이 아닙니다' 항목을 체크해주세요.";
            isValid = false;
        } else {
            document.getElementById("robotCheckError").textContent = "";
        }

        if (isValid) {
            alert("로그인되었습니다. 환영합니다!");
            loginForm.reset();
            document.querySelectorAll("#loginForm input").forEach(function (el) {
                el.classList.remove("input-success");
            });
        }
    });

    // =========================
    // 검색 기능
    // =========================
    // 사용자가 입력한 키워드에 따라 가장 가까운 섹션으로 이동한다.
    searchBtn.addEventListener("click", runSearch);
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            runSearch();
        }
    });

    function runSearch() {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword.includes("소개") || keyword.includes("사이트")) {
            document.getElementById("intro").scrollIntoView({ behavior: "smooth" });
            searchResult.textContent = "사이트 소개 영역으로 이동했어요.";
        } else if (keyword.includes("회원") || keyword.includes("가입")) {
            document.getElementById("signup").scrollIntoView({ behavior: "smooth" });
            searchResult.textContent = "회원가입 영역으로 이동했어요.";
        } else if (keyword.includes("로그인") || keyword.includes("로봇")) {
            document.getElementById("login").scrollIntoView({ behavior: "smooth" });
            searchResult.textContent = "로그인 영역으로 이동했어요.";
        } else if (keyword.includes("고객") || keyword.includes("지원") || keyword.includes("문의")) {
            document.getElementById("support").scrollIntoView({ behavior: "smooth" });
            searchResult.textContent = "고객지원 영역으로 이동했어요.";
        } else if (keyword.includes("루틴") || keyword.includes("플래너") || keyword.includes("할일")) {
            document.getElementById("plan").scrollIntoView({ behavior: "smooth" });
            searchResult.textContent = "루틴 플래너 영역으로 이동했어요.";
        } else if (keyword === "") {
            searchResult.textContent = "검색어를 입력해주세요.";
        } else {
            searchResult.textContent = "일치하는 메뉴를 찾지 못했어요. 예: 회원가입, 로그인, 고객지원";
        }
    }

    // =========================
    // 다크모드 전환 기능
    // =========================
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
    });

    // =========================
    // 루틴 플래너 기능
    // =========================
    // 사용자가 입력한 할 일을 리스트에 추가한다.
    addTodoBtn.addEventListener("click", addTodo);
    todoInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    function addTodo() {
        const todoText = todoInput.value.trim();

        if (todoText === "") {
            alert("추가할 루틴 내용을 입력해주세요.");
            return;
        }

        const li = document.createElement("li");
        const span = document.createElement("span");
        const button = document.createElement("button");

        span.textContent = todoText;
        button.textContent = "완료";
        button.type = "button";
        button.className = "done-btn";

        button.addEventListener("click", function () {
            li.classList.toggle("completed");
            updateTodoStatus();
        });

        li.appendChild(span);
        li.appendChild(button);
        todoList.appendChild(li);

        todoInput.value = "";
        updateTodoStatus();
    }

    // 기존 완료 버튼에도 동일한 기능 연결
    document.querySelectorAll(".done-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            const li = button.parentElement;
            li.classList.toggle("completed");
            updateTodoStatus();
        });
    });

    function updateTodoStatus() {
        const completedCount = document.querySelectorAll(".todo-list li.completed").length;
        todoStatus.textContent = `현재 완료한 루틴: ${completedCount}개`;
    }

    // =========================
    // FAQ 토글 기능
    // =========================
    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            question.parentElement.classList.toggle("active");
        });
    });

    // 페이지 첫 로드 시 완료 개수 초기화
    updateTodoStatus();
});
