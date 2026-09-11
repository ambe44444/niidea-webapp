import { LegalShell, LegalSection } from '@/components/legal/legal-shell'

export const metadata = {
  title: 'Aviso legal — NiIdea',
  description: 'Aviso legal y condiciones de uso de NiIdea, planes sorpresa en Madrid.',
}

export default function AvisoLegalPage() {
  return (
    <LegalShell title="Aviso legal" updated="31 de julio de 2026">
      <LegalSection heading="1. Datos identificativos del titular">
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de
          julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se ponen
          a disposición de los usuarios los siguientes datos del titular de este sitio web:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Denominación comercial: <strong className="text-white">NiIdea</strong></li>
          <li>Titular: <strong className="text-white">Almudena Morales Blanquer</strong></li>
          <li>DNI: 05713431R</li>
          <li>Domicilio: Calle San Cosme y San Damián 9, Bajo C, Madrid, España</li>
          <li>Correo electrónico de contacto: <span suppressHydrationWarning>almublanq@gmail.com</span></li>
        </ul>

      </LegalSection>

      <LegalSection heading="2. Objeto">
        <p>
          El presente aviso legal regula el uso del sitio web de NiIdea (en adelante, “el Sitio Web”), a
          través del cual se ofrece la contratación de experiencias y planes sorpresa en la ciudad de Madrid.
          La característica esencial del servicio es que el usuario adquiere una experiencia sin conocer de
          antemano su contenido concreto, que le será comunicado por NiIdea el día anterior a su disfrute.
        </p>
      </LegalSection>

      <LegalSection heading="3. Condiciones de uso">
        <p>
          El acceso y la navegación por el Sitio Web atribuyen la condición de usuario e implican la
          aceptación plena de todas las cláusulas de este aviso legal. El usuario se compromete a hacer un
          uso adecuado de los contenidos y servicios y a no emplearlos para incurrir en actividades ilícitas
          o contrarias a la buena fe y al ordenamiento jurídico.
        </p>
        <p>
          Para contratar es necesario ser mayor de 18 años y facilitar datos de contacto válidos (correo
          electrónico y número de teléfono móvil con WhatsApp), imprescindibles para la comunicación de los
          detalles de la experiencia.
        </p>
      </LegalSection>

      <LegalSection heading="4. Propiedad intelectual e industrial">
        <p>
          Todos los contenidos del Sitio Web —textos, imágenes, marca, logotipo, diseño y código— son
          titularidad de NiIdea o de terceros que han autorizado su uso, y están protegidos por la normativa
          de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o
          transformación sin autorización expresa del titular.
        </p>
      </LegalSection>

      <LegalSection heading="5. Responsabilidad">
        <p>
          NiIdea selecciona cuidadosamente cada experiencia, si bien no se responsabiliza del uso indebido
          que el usuario haga de la misma ni de conductas que incumplan las normas del establecimiento o
          actividad de destino. NiIdea no garantiza la disponibilidad ininterrumpida del Sitio Web y no será
          responsable de los daños derivados de fallos técnicos ajenos a su control.
        </p>
      </LegalSection>

      <LegalSection heading="6. Legislación aplicable y jurisdicción">
        <p>
          Este aviso legal se rige por la legislación española. Para la resolución de cualquier controversia,
          las partes se someten a los Juzgados y Tribunales de la ciudad de Madrid, salvo que la normativa de
          consumidores establezca un fuero distinto de carácter imperativo.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
