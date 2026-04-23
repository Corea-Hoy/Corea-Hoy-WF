"use client";

import { useLanguageStore } from "@/lib/stores/languageStore";

export default function PrivacyPolicyPage() {
  const { language } = useLanguageStore();
  const isKo = language === "ko";

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 md:p-14 shadow-xl shadow-gray-200/40">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            {isKo ? "개인정보 처리방침" : "Política de Privacidad"}
          </h1>
          <p className="text-sm text-gray-500">
            {isKo ? "최종 수정일: 2026년 4월 23일" : "Última actualización: 23 de abril de 2026"}
          </p>
        </header>

        <div className="space-y-10 text-gray-700 text-sm md:text-base leading-loose">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isKo ? "1. 개인정보의 수집 및 이용 목적" : "1. Propósito de la recolección y uso de datos"}
            </h2>
            <p>
              {isKo
                ? "Corea Hoy(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다."
                : "Corea Hoy (en adelante 'la Empresa') procesa información personal para los siguientes propósitos. La información personal que se procesa no se utilizará para ningún otro propósito."}
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>{isKo ? "회원 가입 및 관리 (로그인)" : "Registro y gestión de miembros (inicio de sesión)"}</li>
              <li>{isKo ? "맞춤형 서비스 제공 및 콘텐츠 추천" : "Provisión de servicios personalizados y recomendación de contenido"}</li>
              <li>{isKo ? "고객 문의 및 피드백 응대 시 사용자 식별" : "Identificación de usuarios al responder consultas y comentarios"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isKo ? "2. 수집하는 개인정보의 항목" : "2. Datos personales que recopilamos"}
            </h2>
            <p>
              {isKo
                ? "회사는 서비스 제공을 위해 최소한의 범위 내에서 아래와 같은 개인정보를 수집하고 있습니다."
                : "La Empresa recopila la siguiente información personal en la medida mínima necesaria para proporcionar el servicio."}
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>{isKo ? "필수 항목: 이메일 주소, 닉네임, 프로필 이미지 (소셜 로그인 연동 시)" : "Requerido: Dirección de correo electrónico, apodo, imagen de perfil (al vincular el inicio de sesión social)"}</li>
              <li>{isKo ? "선택 항목: 고객 문의 시 남기는 추가 이메일 주소" : "Opcional: Dirección de correo electrónico adicional proporcionada para consultas"}</li>
              <li>{isKo ? "자동 수집 항목: IP 주소, 쿠키, 방문 일시, 서비스 이용 기록" : "Recopilado automáticamente: Dirección IP, cookies, fecha y hora de visita, registros de uso del servicio"}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isKo ? "3. 개인정보의 보유 및 이용 기간" : "3. Retención y uso de información personal"}
            </h2>
            <p>
              {isKo
                ? "회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 보유·이용 기간 내에서 개인정보를 처리·보유합니다. 회원이 탈퇴를 요청하거나 개인정보 수집 및 이용에 대한 동의를 철회하는 경우, 해당 개인정보는 지체 없이 파기됩니다."
                : "La Empresa procesa y retiene información personal dentro del período de retención y uso acordado al recopilar información personal del sujeto de datos. Si un miembro solicita retirarse, la información se destruye de inmediato."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isKo ? "4. 사용자 피드백 관련 동의 조항" : "4. Cláusula de consentimiento sobre comentarios de usuarios"}
            </h2>
            <div className="bg-gray-100 p-5 rounded-2xl border-l-4 border-black">
              <p className="font-semibold text-black mb-2">
                {isKo ? "고객 문의 및 버그 리포트 (중요)" : "Consultas de clientes y reportes de errores (Importante)"}
              </p>
              <p>
                {isKo
                  ? "사용자가 로그인한 상태에서 '피드백' 또는 '문의하기' 기능을 이용할 경우, 원활한 서비스 개선 및 문제 해결을 위해 사용자의 계정 정보(식별자, 닉네임)가 제출 내용과 함께 자동으로 수집될 수 있습니다."
                  : "Cuando un usuario utiliza la función de 'Comentarios' o 'Consultas' mientras está conectado, la información de la cuenta (identificador, apodo) se puede recopilar automáticamente junto con el contenido enviado para mejorar el servicio y resolver problemas sin problemas."}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isKo ? "5. 정보주체의 권리" : "5. Derechos del sujeto de datos"}
            </h2>
            <p>
              {isKo
                ? "이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지를 요청할 수 있습니다. 개인정보 보호책임자에게 서면, 전화 또는 이메일로 연락하시면 지체 없이 조치하겠습니다."
                : "Los usuarios pueden ver o modificar su información personal en cualquier momento y solicitar la cancelación de su registro."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
