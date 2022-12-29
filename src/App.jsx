import './scss/form.scss'
import './scss/checkbox.scss'
import { useRef } from 'react'
import { toast } from 'react-toastify';
import File from './File'
import { useState, useEffect } from 'react';
import { AiFillGitlab } from 'react-icons/ai'

function InputGroup({ type, label, placeholder, classe, r, rg, onChange }) {
    const [lab, setLab] = useState(<></>)

    useEffect(() => {
        if (label !== '') { setLab(<label>{label}</label>) }
    }, [label])

    return (
        <div className={`input-group ${classe}`} ref={rg}>
            {lab}
            <input ref={r} type={type} placeholder={placeholder} onChange={onChange} />
        </div>
    )
}

function Checkbox({ label, r, id, onChange }) {
    return (
        <div className='check'>
            <div className='label'>{label}</div>
            <div className="toggle-pill-color">
                <input type="checkbox" id={id} ref={r} onChange={onChange}/>
                <label htmlFor={id}></label>
            </div>
        </div>
    )
}

export default function App() {
    const dev = useRef(null)
    const prod = useRef(null)
    const versioning = useRef(null)
    const nexus = useRef(null)
    const nexusGroup = useRef(null)
    const tests = useRef(null)
    const webhook = useRef(null)
    const webhookInput = useRef(null)
    const webhookGroup = useRef(null)

    function check_data() {
        var flag = true
        if (dev.current.value === '') { toast.error('Veuillez renseigner les branches de developpement'); flag = false }
        if (prod.current.value === '') { toast.error('Veuillez renseigner les branches de production'); flag = false }
        if (versioning.current.checked && nexus.current.value === '') { toast.error('Veuillez renseigner l\'URL de Nexus'); flag = false }
        if (webhook.current.checked && webhookInput.current.value === '') { toast.error('Veuillez renseigner l\'URL du Webhook'); flag = false }
        return flag
    }

    return (
        <div className="form">
            <div className='header'>
                <AiFillGitlab />
                <h1>Gitlab Generator</h1>
            </div>
            <InputGroup type="text" label="" placeholder="Branches de developpement (ex: develop, feat1)" r={dev} />
            <InputGroup type="text" label="" placeholder="Branches de production (ex: master, main)" r={prod} />
            <div className='row'>
                <h1>Options</h1>
                <Checkbox label="Tests unitaires" r={tests} id="tests" />
                <Checkbox label="Version automatique" r={versioning} id="nexus" onChange={() => {
                    if (versioning.current.checked) { nexusGroup.current.style.display = 'flex' }
                    else { nexusGroup.current.style.display = 'none' }
                }} />
                <InputGroup type="text" label="" placeholder="URL Nexus (version HTML)" classe="hide" r={nexus} rg={nexusGroup} />
                <Checkbox label="Portainer" id="webhook" r={webhook} onChange={() => {
                    if (webhook.current.checked) { webhookGroup.current.style.display = 'flex' }
                    else { webhookGroup.current.style.display = 'none' }
                }} />
                <InputGroup type="text" label="" placeholder="URL Webhook Portainer" classe="hide" r={webhookInput} rg={webhookGroup} />
            </div>
            <button onClick={() => {
                if (!check_data()) return
                File(
                    dev.current.value,
                    prod.current.value,
                    versioning.current.checked,
                    nexus.current.value,
                    tests.current.checked,
                    webhook.current.checked,
                    webhookInput.current.value
                )
            }}>Valider</button>
        </div>
    )
}