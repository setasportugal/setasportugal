'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

import PageHeader from '../../../components/ui/PageHeader'
import Card from '../../../components/ui/Card'
import FormSection from '../../../components/ui/FormSection'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import Button from '../../../components/ui/Button'

export default function NovaAssociacaoPage() {

  const router = useRouter()

  const [saving,setSaving] = useState(false)

  const [form,setForm] = useState({

    name:'',
    short_name:'',
    region:'',
    founded_year:'',
    website:'',
    facebook:'',
    instagram:'',
    notes:''

  })

  function update(field,value){

    setForm(prev=>({

      ...prev,
      [field]:value

    }))

  }

  async function save(e){

    e.preventDefault()

    if(!form.name.trim()){

      alert('Indica o nome da associação.')

      return

    }

    setSaving(true)

    const {error} = await supabase

      .from('associations')

      .insert({

        name:form.name,
        short_name:form.short_name || null,
        region:form.region || null,
        founded_year:form.founded_year || null,
        website:form.website || null,
        facebook:form.facebook || null,
        instagram:form.instagram || null,
        notes:form.notes || null

      })

    setSaving(false)

    if(error){

      alert(error.message)

      return

    }

    router.push('/associacoes')

  }

  return(

    <>

<PageHeader

icon="🏛️"

title="Nova Associação"

description="Regista uma associação organizadora de competições de setas."

/>

<form onSubmit={save}>

<Card>

<FormSection

title="Identificação"

description="Informação principal da associação."

columns={2}

>

<Input

label="Nome"

required

placeholder="Associação Portuguesa de Setas"

value={form.name}

onChange={e=>update('name',e.target.value)}

/>

<Input

label="Sigla"

placeholder="APS"

value={form.short_name}

onChange={e=>update('short_name',e.target.value)}

/>
<Input

label="Região"

placeholder="Centro"

value={form.region}

onChange={e=>update('region',e.target.value)}

/>

<Input

label="Ano de fundação"

type="number"

placeholder="1998"

value={form.founded_year}

onChange={e=>update('founded_year',e.target.value)}

/>

</FormSection>

</Card>

<Card>

<FormSection

title="Presença Online"

description="Todos os campos desta secção são opcionais."

>

<Input

label="Website"

placeholder="https://..."

value={form.website}

onChange={e=>update('website',e.target.value)}

/>

<Input

label="Facebook"

placeholder="https://facebook.com/..."

value={form.facebook}

onChange={e=>update('facebook',e.target.value)}

/>

<Input

label="Instagram"

placeholder="https://instagram.com/..."

value={form.instagram}

onChange={e=>update('instagram',e.target.value)}

/>

</FormSection>

</Card>

<Card>

<FormSection

title="Observações"

description="Informação adicional que possa ser útil futuramente."

>

<Textarea

label="Notas"

rows={8}

placeholder="Escreve aqui qualquer informação adicional..."

value={form.notes}

onChange={e=>update('notes',e.target.value)}

/>

</FormSection>

</Card>
<div className="actions">

<Button

variant="secondary"

type="button"

onClick={()=>router.push('/associacoes')}

>

Cancelar

</Button>

<Button

type="submit"

disabled={saving}

>

{saving ? 'A guardar...' : 'Guardar Associação'}

</Button>

</div>

</form>

<div
  style={{
    marginTop:40,
    background:'#eff6ff',
    border:'1px solid #bfdbfe',
    borderRadius:12,
    padding:20
  }}
>

<h3
  style={{
    marginTop:0,
    marginBottom:10,
    color:'#1e3a8a'
  }}
>
💡 Sugestão
</h3>

<p
  style={{
    margin:0,
    color:'#334155',
    lineHeight:1.7
  }}
>
As redes sociais e o website podem ser adicionados mais tarde.
O único campo obrigatório para criar uma associação é o <strong>Nome</strong>.
</p>

</div>

</>

  )

}
